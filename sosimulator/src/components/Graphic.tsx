import { IProcess } from "../App";

function getColor(id: number) {
  switch (id) {
    case 0:
      //n chegou
      return "#FFF";
    case 1:
      //executando
      return "green";
    case 2:
      //esperando
      return "red";
    case 3:
      //deadline
      return "black";
  }
}

export default function Graphic({ data, onClose }: any) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <button onClick={onClose}>Voltar</button>
      Tempo médio de turnaround: {data.averageTurnaroundTime}
      {data.result
        .sort((a, b) => b.processNumber - a.processNumber)
        .map((d: any) => {
          return (
            <div
              style={{
                width: "max-content",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {d.processNumber}
              <div>
                {d.result.map((r: number, i: number) => {
                  return (
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: getColor(r),
                        border: "1px solid black",
                        display: "inline-block",
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
