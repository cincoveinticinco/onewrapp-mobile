interface SceneInfoLabelsProps {
  info: string;
  title: string;
  symbol?: string;
}

const SceneInfoLabels: React.FC<SceneInfoLabelsProps> = ({ info, title, symbol }) => (
  <div className="ion-flex-column" style={{ textAlign: 'center', height: '100%', justifyContent: 'space-around' }}>
    <p className="ion-no-margin" style={{ fontSize: '20px' }}>
      <b>{info.toUpperCase()}</b>
      <span className="symbol-part" style={{ fontSize: '14px', position: 'absolute', fontWeight: 'bold' }}>{symbol}</span>
    </p>
    <p className="ion-no-margin" style={{ fontSize: '8px', margin: '6px' }}>{title.toUpperCase()}</p>
  </div>
);

export default SceneInfoLabels;
