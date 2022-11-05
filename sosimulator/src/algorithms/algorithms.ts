import { IProcess } from "../App";

export function fifo(processes: IProcess[]) {
  const queue = [];
  let time = 0;
  let result = [];
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
        waitTime: +waitTime,
      });
      time += +process.executionTime;
    } else {
      time = +processes[i].arrivalTime;
    }
  }
  result = result.sort((a, b) => a.process - b.process);
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
  let result = [];
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
        waitTime: +waitTime,
      });
      time += +process.executionTime;
    } else {
      time = +processes[i].arrivalTime;
    }
  }
  result = result.sort((a, b) => a.process - b.process);
  const turnaroundTime = result.reduce(
    (acc, curr) => acc + curr.totalExecutionTime,
    0
  );
  const averageTurnaroundTime = turnaroundTime / processes.length;
  return { result, averageTurnaroundTime };
}

export function edf(processes: IProcess[], quantum: number, overload: number) {
  const queue = [];
  let time = 0;
  const result = [];
  let i = 0;
  while (i < processes.length || queue.length > 0) {
    while (i < processes.length && processes[i].arrivalTime <= time) {
      queue.push(
        processes.map((process) => ({
          ...process,
          alreadyExecuted: 0,
          totalOverloaded: 0,
          waitingTime: 0,
          deadline: process.deadline + time,
        }))[i]
      );
      i++;
    }
    queue.sort((a, b) => a.deadline - b.deadline);

    if (queue.length > 0) {
      const process = queue.shift();
      if (!process) {
        continue;
      }
      process.waitingTime = time - process.arrivalTime;
      if (process.alreadyExecuted + quantum >= process.executionTime) {
        result.push({
          process: +process.processNumber,
          start: +time,
          end: +time + +process.executionTime - process.alreadyExecuted,
          totalExecutionTime: +process.executionTime + process.waitingTime,
        });
        time += quantum;
      } else {
        process.alreadyExecuted += quantum;
        process.totalOverloaded += overload;
        time += quantum + overload;
      }
    }
  }
  const turnaroundTime = result.reduce(
    (acc, curr) => acc + curr.totalExecutionTime,
    0
  );
  const averageTurnaroundTime = turnaroundTime / processes.length;
  return { result, averageTurnaroundTime };
}

export function roundRobin(
  processes: IProcess[],
  quantum: number,
  overload: number
) {
  const queue = [];
  let time = 0;
  const result = [];
  let processesInQueue = 0;
  while (processesInQueue < processes.length || queue.length > 0) {
    while (
      processesInQueue < processes.length &&
      processes[processesInQueue].arrivalTime <= time
    ) {
      queue.push(
        processes.map((process) => ({
          ...process,
          alreadyExecuted: 0,
          totalOverloaded: 0,
          waitingTime: 0,
          startTime: 0,
        }))[processesInQueue]
      );
      processesInQueue++;
    }
    if (queue.length > 0) {
      const process = queue.shift();
      if (!process) {
        continue;
      }
      process.waitingTime = time - +process.arrivalTime;
      if (+process.startTime === 0 && time > 0) {
        process.startTime = time;
      }
      if (+process.alreadyExecuted + quantum >= +process.executionTime) {
        result.push({
          process: +process.processNumber,
          start: +process.startTime,
          end: +time + +process.executionTime - +process.alreadyExecuted,
          totalExecutionTime:
            +process.executionTime +
            +process.waitingTime +
            +process.totalOverloaded,
        });
        time += +quantum;
      } else {
        process.alreadyExecuted += +quantum;
        process.totalOverloaded += +overload;
        time = time + +quantum + +overload;
        queue.push(process);
      }
    }
  }
  const turnaroundTime = result.reduce(
    (acc, curr) => acc + curr.totalExecutionTime,
    0
  );
  const averageTurnaroundTime = turnaroundTime / processes.length;
  return { result, averageTurnaroundTime };
}
