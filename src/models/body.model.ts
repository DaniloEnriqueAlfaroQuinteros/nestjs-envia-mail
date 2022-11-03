class Contact {
  constructor(code: string, value: any | string | number) {
    this.code = code;
    this.value = value;
  }
  code: string;
  value: any | string | number;
}
class Options {
  constructor() {
    this.identification = '1111111';
    this.names = 'Juan';
    this.lastNames = 'Manuel';
    this.contact.push(new Contact('PHONE', 5623343492));
    this.contact.push(new Contact('CELLPHONE', 5623343492));
  }
  identification: string;
  names: string;
  lastNames: string;
  contact: Contact[] = [];
}
class ShippingInformation {
  constructor() {
    this.options = new Options();
  }
  options: Options;
}
class IdentificationType {
  constructor() {
    this.code = 'RUT';
    this.name = 'Registro Único de Contribuyentes';
  }
  code: string;
  name: string;
}
class CustomerInformation {
  constructor() {
    this.identification = '160258055';
    this.identificationType = new IdentificationType();
  }
  identification: string;
  identificationType: IdentificationType;
}
class Custom {
  constructor() {
    (this.ccIdentification = ''), (this.capturedDate = '2019-06-27 13:14:39');
    this.sellerCode = '10040';
    this.status = '0';
    this.pointOfSaleIdentification = '1';
    this.idDTE = '1111';
    this.customerInformation = new CustomerInformation();
    this.contact.push(new Contact('EMAIL', 'jose@example.com'));
    this.shippingInformation = new ShippingInformation();
  }
  ccIdentification: string;
  capturedDate: string;
  sellerCode: string;
  status: string;
  pointOfSaleIdentification: string;
  idDTE: string;
  customerInformation: CustomerInformation;
  contact: Contact[] = [];
  shippingInformation: ShippingInformation;
}
export class BodyOrder {
  constructor() {
    this.type = 'BLT';
    this.amount = 2000;
    this.custom = new Custom();
  }
  type: string;
  amount: number;
  custom: Custom;
}
