import { IProcess } from "../App";

export function fifo(processes: IProcess[]) {
  const queue = [];
  let time = 0;
  const result = [];
  let i = 0;
  while (i < processes.length || queue.length > 0) {
    if (i < processes.length && processes[i].arrivalTime <= time) {
      queue.push(processes[i]);
      i++;
    }
    if (queue.length > 0) {
      const process = queue.shift();
      if (!process) {
        continue;
      }
      let waitTime = time - process.arrivalTime;
      result.push({
        process: +process.processNumber,
        start: +time,
        end: +time + +process.executionTime,
        totalExecutionTime: +process.executionTime + waitTime,
      });
      time += +process.executionTime;
    } else {
      time = +processes[i].arrivalTime;
    }
  }
  const turnaroundTime = result.reduce(
    (acc, curr) => acc + curr.totalExecutionTime,
    0
  );
  const averageTurnaroundTime = turnaroundTime / processes.length;
  return { result, averageTurnaroundTime };
}

export function sjf(processes: IProcess[]) {
  const queue = [];
  let time = 0;
  const result = [];
  let i = 0;
  while (i < processes.length || queue.length > 0) {
    while (i < processes.length && processes[i].arrivalTime <= time) {
      queue.push(processes[i]);
      i++;
    }
    queue.sort((a, b) => a.executionTime - b.executionTime);
    if (queue.length > 0) {
      const process = queue.shift();
      if (!process) {
        continue;
      }
      let waitTime = time - process.arrivalTime;
      result.push({
        process: +process.processNumber,
        start: +time,
        end: +time + +process.executionTime,
        totalExecutionTime: +process.executionTime + waitTime,
      });
      time += +process.executionTime;
    } else {
      time = +processes[i].arrivalTime;
    }
  }
  const turnaroundTime = result.reduce(
    (acc, curr) => acc + curr.totalExecutionTime,
    0
  );
  const averageTurnaroundTime = turnaroundTime / processes.length;
  return { result, averageTurnaroundTime };
}
