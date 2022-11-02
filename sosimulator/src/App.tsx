import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";
import ProcessCard from "./components/ProcessCard";

export interface IProcess {
  processNumber: number;
  arrivalTime: number;
  executionTime: number;
  deadline: number;
}

function App() {
  const [processNumber, setProcessNumber] = useState(0);
  const [quantum, setQuantum] = useState(0);
  const [overload, setOverload] = useState(0);
  const [processes, setProcesses] = useState<IProcess[]>([]);

  useEffect(() => {
    const newProcesses: IProcess[] = [];
    for (let i = 0; i < processNumber; i++) {
      newProcesses.push({
        processNumber: i + 1,
        arrivalTime: 0,
        executionTime: 0,
        deadline: 0,
      });
    }
    setProcesses(newProcesses);
  }, [processNumber]);

  return (
    <div className="App">
      <TextField
        type="number"
        label="Quantum"
        value={quantum}
        onChange={(e: any) => setQuantum(e.target.value)}
      />
      <TextField
        type="number"
        label="Sobrecarga"
        value={overload}
        onChange={(e: any) => setOverload(e.target.value)}
      />
      <TextField
        type="number"
        label="Quantidade de processos"
        value={processNumber}
        onChange={(e: any) => setProcessNumber(e.target.value)}
      />
      {processes.map((process) => (
        <ProcessCard process={process} />
      ))}
      <button>Iniciar</button>
    </div>
  );
}

export default App;
