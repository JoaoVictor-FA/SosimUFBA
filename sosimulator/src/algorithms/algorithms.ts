import { Interval, IProcess } from "../App";

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
  console.log("fifo result", result)
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
){
  const queue : IProcess[] = [];
  let time = 0;
  const result : IProcess[] = [];
  let processExecuting : IProcess | undefined = undefined;
  let quantumRemaining = quantum;
  let overloadRemaining = overload;
  while(processExecuting || processes.length > 0 || queue.length > 0){
    //Coloca na fila processos enquanto existirem processos com o tempo de chegada igual ao instante
    while(processes.length > 0 && processes[0].arrivalTime == time){
      const processToBeQueued = processes.shift()!; //Garante que tem processos para dar o shift já que o while roda com proccesses.length > 0
      processToBeQueued.remainingTime = processToBeQueued.executionTime; //Define tempo restante de execução
      processToBeQueued.intervals = [];
      queue.push(processToBeQueued);
    }
    //Tira da fila para executar o processo apenas se não existir um processo sendo executado e que tenha processos na fila de espera
    if(!processExecuting && queue.length > 0){
      processExecuting = queue.shift()!;
      processExecuting?.intervals.push({start: time, end: undefined});
    }
    //Passa o tempo e continua o while caso não exista processo para ser executado no momento
    if(!processExecuting){
      time++;
      continue;
    }
    
    if(quantumRemaining > 0 && processExecuting.remainingTime > 0){
      processExecuting.remainingTime--;
      quantumRemaining--;
    } else if(overloadRemaining > 0 && processExecuting.remainingTime > 0){
      overloadRemaining--;
    } 

    if(processExecuting.remainingTime == 0 || quantumRemaining == 0 && overloadRemaining == 0) {
      quantumRemaining = quantum;
      overloadRemaining = overload;
      const interval = processExecuting.intervals.pop(); //Pega o último intervalo que ainda não foi finalizado
      processExecuting.intervals.push({start: interval!.start,  end: time + 1}) //Define o início e fim do último intervalo executado
      if(processExecuting.remainingTime == 0){
        result.push(processExecuting); //Envia para o array de resultados caso tenha executado completamente
      } else if(processExecuting.remainingTime > 0){
        queue.push(processExecuting); //Envia para a fila caso contrário
      }
      processExecuting = undefined;
    }
    time++;
  }

  const turnaroundTime = result.reduce((acc, curr) => 
    acc + (curr.intervals[curr.intervals.length -1].end! - curr.arrivalTime)
  , 0);
  const averageTurnaroundTime = turnaroundTime / result.length;

  return {result, averageTurnaroundTime}
}

export function roundRobin1(
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
      console.log(process)
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
  console.log("round robin", result)
  console.log("round robin", averageTurnaroundTime)
  return { result, averageTurnaroundTime };
}
