import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { isError } from 'lodash';

type MessageHandler = (message: Message) => Promise<void>;

export class PubSubServer extends Server implements CustomTransportStrategy {
  constructor() {
    super();
    const buffer = Buffer.from(
      process.env.GCLOUD_CREDENTIALS_SUBSCRIPTION_B64,
      'base64',
    );
    //const credentialDecode = process.env.GCLOUD_CREDENTIALS_SUBSCRIPTION_B64;

    const credentialDecode = buffer ? buffer.toString() : null;
    const credentialJson = JSON.parse(credentialDecode);
    this.client = new PubSub({
      projectId: this.projectId,
      credentials: credentialJson,
    });
  }

  private projectId = process.env.GCLOUD_PROJECT_ID_SUBSCRIPTION;
  private subscription = process.env.GCLOUD_SUBSCRIPTION_NAME;
  private pullLimit = +process.env.GCLOUD_SUBSCRIPTION_PULL_LIMIT;
  private readonly subscriptions: { [subId: string]: Subscription } = {};

  private client: PubSub;

  listen(callback: () => void) {
    const registeredPatterns = [...this.messageHandlers.keys()];
    const subscribeAll = registeredPatterns.map((subId) =>
      this.subscribe(subId),
    );

    Promise.all(subscribeAll)
      .then(() => callback())
      .catch((e) => this.handleError(e));
  }

  close() {
    Object.values(this.subscriptions).forEach((sub) => {
      sub.close().catch((e) => this.handleError(e));
    });
  }

  protected handleError(error: any) {
    if (isError(error)) {
      super.handleError(error.stack || error.toString());
    } else {
      super.handleError(error);
    }
  }

  private async subscribe(subId: string): Promise<void> {
    const subscription = this.subscription;

    const sub = await this.getSubscription(subscription);
    const handler = this.getMessageHandler(subscription);

    sub.on('message', handler.bind(this));
    sub.on('error', (e) => this.handleError(e));

    this.subscriptions[subId] = sub;
  }

  private getMessageHandler(subId: string): MessageHandler {
    return async (message: Message) => {
      const handler = this.getHandlerByPattern(subId);

      if (!handler) {
        //this.logger.warn(`No handler for message ${message.id}`);
        //this.logger.warn(`               message.data=${message.data}`);
        message.ack();
        return;
      }

      //this.logger.info(`Resp Correcta en PubSubServer() --> message.data=${message.data}`);

      await handler(message.data);
    };
  }

  private async getSubscription(subscription: string): Promise<Subscription> {
    const sub = this.client.subscription(subscription, {
      flowControl: {
        maxMessages: this.pullLimit || 10,
      },
    });
    return sub;
  }
}
