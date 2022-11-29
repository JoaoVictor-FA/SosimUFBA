import { IProcess } from "../App";

interface IComputedProcess {
  waitingTime: number;
  startTime: number;
  endTime: number;
  turnAroundTime: number;
  totalOverloaded: number;
  executionTime: number;
  processNumber: number;
  alreadyExecuted: number;
  arrivalTime: number;
}

export enum AlgorithmType {
  fifo = "fifo",
  sjf = "sjf",
  edf = "edf",
  rr = "rr",
}

export function fifo(processes: IProcess[]) {
  const queue = [];
  let time = 0;
  let result = [];
  let contadorProcessos = 0;
  while (contadorProcessos < processes.length || queue.length > 0) {
    if (
      contadorProcessos < processes.length &&
      processes[contadorProcessos].arrivalTime <= time
    ) {
      queue.push(processes[contadorProcessos]);
      contadorProcessos++;
    }
    if (queue.length > 0) {
      const process = queue.shift();
      if (!process) {
        continue;
      }
      const waitTime = time - process.arrivalTime;
      result.push({
        processNumber: +process.processNumber,
        start: +time,
        end: +time + +process.executionTime,
        totalExecutionTime: +process.executionTime + waitTime,
        waitTime: +waitTime,
        arrivalTime: +process.arrivalTime,
      });
      time += +process.executionTime;
    } else {
      time = +processes[contadorProcessos].arrivalTime;
    }
  }
  result = result.sort((a, b) => a.processNumber - b.processNumber);
  const turnaroundTime = result.reduce(
    (acc, curr) => acc + curr.totalExecutionTime,
    0
  );
  const averageTurnaroundTime = turnaroundTime / processes.length;
  return { result, averageTurnaroundTime };
}

export function sjf(processes: IProcess[]) {
  const queue: IComputedProcess[] = [];
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
        processNumber: +process.processNumber,
        start: +time,
        end: +time + +process.executionTime,
        totalExecutionTime: +process.executionTime + waitTime,
        waitTime: +waitTime,
        arrivalTime: +process.arrivalTime,
      });
      time += +process.executionTime;
    } else {
      time = +processes[i].arrivalTime;
    }
  }
  result = result.sort((a, b) => a.processNumber - b.processNumber);
  const turnaroundTime = result.reduce(
    (acc, curr) => acc + curr.totalExecutionTime,
    0
  );
  const averageTurnaroundTime = turnaroundTime / processes.length;
  return { result, averageTurnaroundTime };
}

export function edf(
  processesIncome: IProcess[],
  quantum: number,
  overload: number
) {
  const queue: IProcess[] = [];
  let time = 0;
  const result: IProcess[] = [];
  let processExecuting: IProcess | undefined = undefined;
  let quantumRemaining = quantum;
  let overloadRemaining = overload;
  const processes = [...processesIncome];
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  while (processExecuting || processes.length > 0 || queue.length > 0) {
    //Coloca na fila processos enquanto existirem processos com o tempo de chegada igual ao instante
    while (processes.length > 0 && processes[0].arrivalTime == time) {
      const processToBeQueued = processes.shift()!; //Garante que tem processos para dar o shift já que o while roda com proccesses.length > 0
      processToBeQueued.remainingTime = processToBeQueued.executionTime; //Define tempo restante de execução
      processToBeQueued.intervals = [];
      queue.push(processToBeQueued);
      queue.sort(
        (a, b) => a.arrivalTime + a.deadline - (b.arrivalTime + b.deadline)
      );
    }

    if (
      processExecuting &&
      (processExecuting.remainingTime == 0 ||
        (quantumRemaining == 0 && overloadRemaining == 0))
    ) {
      quantumRemaining = quantum;
      overloadRemaining = overload;
      const interval = processExecuting.intervals.pop(); //Pega o último intervalo que ainda não foi finalizado
      processExecuting.intervals.push({ start: interval!.start, end: time }); //Define o início e fim do último intervalo executado
      if (processExecuting.remainingTime == 0) {
        processExecuting.timeFinished = time;
        processExecuting.overDeadline =
          processExecuting.arrivalTime + processExecuting.deadline < time
            ? true
            : false;
        result.push(processExecuting); //Envia para o array de resultados caso tenha executado completamente
      } else if (processExecuting.remainingTime > 0) {
        queue.push(processExecuting); //Envia para a fila caso contrário
        queue.sort(
          (a, b) => a.arrivalTime + a.deadline - (b.arrivalTime + b.deadline)
        );
      }
      processExecuting = undefined;
    }

    //Tira da fila para executar o processo apenas se não existir um processo sendo executado e que tenha processos na fila de espera
    if (!processExecuting && queue.length > 0) {
      processExecuting = queue.shift()!;
      processExecuting?.intervals.push({ start: time, end: undefined });
    }
    //Passa o tempo e continua o while caso não exista processo para ser executado no momento
    if (!processExecuting) {
      time++;
      continue;
    }

    if (quantumRemaining > 0 && processExecuting.remainingTime > 0) {
      processExecuting.remainingTime--;
      quantumRemaining--;
    } else if (overloadRemaining > 0 && processExecuting.remainingTime > 0) {
      overloadRemaining--;
    }

    time++;
  }

  const turnaroundTime = result.reduce(
    (acc, curr) =>
      acc + (curr.intervals[curr.intervals.length - 1].end! - curr.arrivalTime),
    0
  );
  const averageTurnaroundTime = turnaroundTime / result.length;
  return { result, averageTurnaroundTime };
}

export function roundRobin(
  processesIncome: IProcess[],
  quantum: number,
  overload: number
) {
  const queue: IProcess[] = [];
  let time = 0;
  const result: IProcess[] = [];
  let processExecuting: IProcess | undefined = undefined;
  let quantumRemaining = quantum;
  let overloadRemaining = overload;
  const processes = [...processesIncome];
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  while (processExecuting || processes.length > 0 || queue.length > 0) {
    //Coloca na fila processos enquanto existirem processos com o tempo de chegada igual ao instante
    while (processes.length > 0 && processes[0].arrivalTime == time) {
      const processToBeQueued = processes.shift()!; //Garante que tem processos para dar o shift já que o while roda com proccesses.length > 0
      processToBeQueued.remainingTime = processToBeQueued.executionTime; //Define tempo restante de execução
      processToBeQueued.intervals = [];
      queue.push(processToBeQueued);
    }

    //Joga processos finalizados nos resultados ou processos com ciclos finalizados de volta para a fila
    if (
      processExecuting &&
      (processExecuting.remainingTime == 0 ||
        (quantumRemaining == 0 && overloadRemaining == 0))
    ) {
      quantumRemaining = quantum;
      overloadRemaining = overload;
      const interval = processExecuting.intervals.pop(); //Pega o último intervalo que ainda não foi finalizado
      processExecuting.intervals.push({ start: interval!.start, end: time }); //Define o início e fim do último intervalo executado
      if (processExecuting.remainingTime == 0) {
        result.push(processExecuting); //Envia para o array de resultados caso tenha executado completamente
      } else if (processExecuting.remainingTime > 0) {
        queue.push(processExecuting); //Envia para a fila caso contrário
      }
      processExecuting = undefined;
    }

    //Tira da fila para executar o processo apenas se não existir um processo sendo executado e que tenha processos na fila de espera
    if (!processExecuting && queue.length > 0) {
      processExecuting = queue.shift()!;
      processExecuting?.intervals.push({ start: time, end: undefined });
    }
    //Passa o tempo e continua o while caso não exista processo para ser executado no momento
    if (!processExecuting) {
      time++;
      continue;
    }

    if (quantumRemaining > 0 && processExecuting.remainingTime > 0) {
      processExecuting.remainingTime--;
      quantumRemaining--;
    } else if (overloadRemaining > 0 && processExecuting.remainingTime > 0) {
      overloadRemaining--;
    }

    time++;
  }

  const turnaroundTime = result.reduce(
    (acc, curr) =>
      acc + (curr.intervals[curr.intervals.length - 1].end! - curr.arrivalTime),
    0
  );
  const averageTurnaroundTime = turnaroundTime / result.length;

  return { result, averageTurnaroundTime };
}
