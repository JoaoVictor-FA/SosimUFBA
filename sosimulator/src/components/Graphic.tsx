import { Typography } from "@mui/material";

function getColor(id: number) {
  switch (id) {
    case 0:
      //não chegou
      return "#FFF";
    case 1:
      //executando
      return "green";
    case 2:
      //esperando
      return "yellow";
    case 3:
      //deadline
      return "gray";
    case 4:
      //sobrecarga
      return "red";
  }
}

function getLabelById(id: number) {
  switch (id) {
    case 0:
      return "Não chegou";
    case 1:
      return "Executando";
    case 2:
      return "Esperando";
    case 3:
      return "Executando após Deadline";
    case 4:
      return "Sobrecarga";
  }
}

export default function Graphic({ data, onClose, animated }: any) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <button onClick={onClose}>Voltar</button>
      Tempo médio de turnaround: {data.averageTurnaroundTime.toFixed(2)}
      <div style={{ position: "relative", width: 'max-content' }}>
        {animated && <div className="slide" />}
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
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  {d.result.map((r: number, i: number) => {
                    return (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: getColor(r),
                          border: "1px solid black",
                        }}
                      >
                        {i == d.result.indexOf(3) ? "D" : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "16px",
          textAlign: "start",
        }}
      >
        <Typography variant={"h6"}>Legenda:</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {Array.from({ length: 5 }, (_, i) => i).map((i) => {
              return (
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: getColor(i),
                      border: "1px solid black",
                    }}
                  ></div>
                  <Typography>{getLabelById(i)}</Typography>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: "16px" }}>
              <Typography>D</Typography>
              <Typography>Deadline</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
