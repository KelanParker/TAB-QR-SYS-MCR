function App() {
  const tablets = [
    { id: 1, channel: "Hiru FM", status: "Available" },
    { id: 2, channel: "Sun FM", status: "Available" },
    { id: 3, channel: "Gold FM", status: "Available" },
    { id: 4, channel: "Shaa FM", status: "Available" },
    { id: 5, channel: "Sooriyan FM", status: "Available" },
    { id: 6, channel: "Y FM", status: "Available" },
    { id: 7, channel: "Hiru Life", status: "Available" },
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>MCR Tablet Management System</h1>

      <h2>Tablets</h2>

      {tablets.map((tablet) => (
        <div
          key={tablet.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <strong>{tablet.channel}</strong>

          <p>{tablet.status}</p>
        </div>
      ))}
    </div>
  );
}

export default App;