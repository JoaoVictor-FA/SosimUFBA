import {
  AlgorithmType,
  edf,
  fifo,
  roundRobin,
  sjf,
} from "../algorithms/algorithms";
import { IGraphicData, Interval, IProcess, IResult } from "../App";

interface IProps {
  processes: IProcess[];
  algorithm: AlgorithmType;
  quantum: number;
  overload: number;
  setData: (data: IGraphicData) => void;
  setGraphic: (value: boolean) => void;
}

export default function convertDataToGraphic({
  processes,
  algorithm,
  quantum,
  overload,
  setData,
  setGraphic,
}: IProps) {
  let res = null;
  let arr: IResult[] = [];
  if (processes.find((p) => p.arrivalTime === 0) === undefined) {
    alert("Algum processo precisa chegar no tempo 0");
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime)[0].arrivalTime = 0;
  }
  switch (algorithm) {
    case "fifo":
      res = fifo(processes.sort((a, b) => a.arrivalTime - b.arrivalTime));
      arr = [];
      res.result.forEach((r: any) => {
        arr.push({
          processNumber: r.processNumber,
          result: Array.from(Array(r.end).keys())
            .fill(0, 0, r.arrivalTime)
            .fill(2, r.arrivalTime, r.start)
            .fill(1, r.start, r.end),
        });
      });
      break;
    case "sjf":
      res = sjf(processes);
      arr = [];
      res.result.forEach((r: any) => {
        arr.push({
          processNumber: r.processNumber,
          result: Array.from(Array(r.end).keys())
            .fill(0, 0, r.arrivalTime)
            .fill(2, r.arrivalTime, r.start)
            .fill(1, r.start, r.end),
        });
      });

      break;
    case "edf":
      res = edf(processes, quantum, overload);
      res.result.forEach((r: any) => {
        const notProcessedPositions: number[] = [];
        const firstProcessedPosition = r.intervals[0].start;
        const processedPositions: number[] = [];
        const overloadPositions: number[] = [];
        const deadlinePositions: number[] = [];
        const trueDeadline = r.arrivalTime + r.deadline;

        r.intervals.forEach((interval: Interval, i: number) => {
          if (i < r.intervals.length - 1) {
            if (interval.end && r.intervals[i + 1].start !== interval.end) {
              const diff = r.intervals[i + 1].start - interval.end;
              notProcessedPositions.push(
                ...Array.from(Array(diff).keys()).map(
                  (n) => n + (interval.end !== undefined ? interval.end : 0)
                )
              );
            }
          }
        });
        for (
          let i = firstProcessedPosition;
          i < r.intervals[r.intervals.length - 1].end;
          i++
        ) {
          if (!notProcessedPositions.includes(i)) {
            if (i >= trueDeadline) {
              deadlinePositions.push(i);
            } else {
              processedPositions.push(i);
            }
          }
        }

        for (let interval of r.intervals) {
          if (interval.end - interval.start > quantum) {
            for (let i = +interval.start + +quantum; i < +interval.end; i++) {
              overloadPositions.push(i);
            }
          }
        }

        const result = Array.from(
          Array(r.intervals[r.intervals.length - 1].end)
        ).fill(0);

        if (r.arrivalTime < firstProcessedPosition) {
          result.fill(2, r.arrivalTime, firstProcessedPosition);
        }

        processedPositions.forEach((p: number) => {
          result[p] = 1;
        });
        notProcessedPositions.forEach((p: number) => {
          result[p] = 2;
        });
        deadlinePositions.forEach((p: number) => {
          result[p] = 3;
        });
        overloadPositions.forEach((p: number) => {
          result[p] = 4;
        });

        arr.push({
          processNumber: r.processNumber,
          result,
          deadline: trueDeadline,
        });
      });
      break;
    case "rr":
      res = roundRobin(processes, quantum, overload);
      res.result.forEach((r: any, i: number) => {
        const notProcessedPositions: number[] = [];
        const firstProcessedPosition = r.intervals[0].start;
        const processedPositions: number[] = [];
        const overloadPositions: number[] = [];

        r.intervals.forEach((interval: Interval, i: number) => {
          if (i < r.intervals.length - 1) {
            if (interval.end && r.intervals[i + 1].start !== interval.end) {
              const diff = r.intervals[i + 1].start - interval.end;
              notProcessedPositions.push(
                ...Array.from(Array(diff).keys()).map(
                  (n) => n + (interval.end !== undefined ? interval.end : 0)
                )
              );
            }
          }
        });
        for (
          let i = firstProcessedPosition;
          i < r.intervals[r.intervals.length - 1].end;
          i++
        ) {
          if (!notProcessedPositions.includes(i)) {
            processedPositions.push(i);
          }
        }

        for (let interval of r.intervals) {
          if (interval.end - interval.start > quantum) {
            for (let i = +interval.start + +quantum; i < +interval.end; i++) {
              overloadPositions.push(i);
            }
          }
        }

        const result = Array.from(
          Array(r.intervals[r.intervals.length - 1].end)
        ).fill(0);

        if (r.arrivalTime < firstProcessedPosition) {
          result.fill(2, r.arrivalTime, firstProcessedPosition);
        }

        processedPositions.forEach((p: number) => {
          result[p] = 1;
        });
        notProcessedPositions.forEach((p: number) => {
          result[p] = 2;
        });
        overloadPositions.forEach((p: number) => {
          result[p] = 4;
        });
        arr.push({
          processNumber: r.processNumber,
          result,
        });
      });

      break;
  }
  setData({
    result: arr,
    averageTurnaroundTime: res?.averageTurnaroundTime || 0,
  });
  setGraphic(true);
}
