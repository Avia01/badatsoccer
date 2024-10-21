import '../styles/LogViewer.css'

function LogViewer({logs}) {
    const logLines = logs.split('\n');

    return (
        <div className="log-container" style={{fontFamily: 'monospace'}}>
            <h2>Server Logs</h2>
            <div className="logs">{logLines.map((line, index) => (
                <div key={index} style={{display: 'flex'}}>
                    <span style={{color: '#888', marginRight: '10px'}}>{index + 1}</span>
                    <span>{line}</span>
                </div>
            ))}
            </div>
        </div>
    );
}

export default LogViewer;