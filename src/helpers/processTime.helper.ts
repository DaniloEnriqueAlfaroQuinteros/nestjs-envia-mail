export const processTime = {
  async getStartTime(): Promise<[number, number]> {
    return process.hrtime();
  },
  async getFinishTimeString(startTime: [number, number]): Promise<string> {
    const finish = process.hrtime(startTime);
    return `${finish[0]}s ${String(
      Math.floor(finish[1] / (1000 * 1000)),
    ).padStart(3, '0')}ms`;
  },
};
