import './InfoLabel.scss';

const InfoLabel: React.FC<{ label: string, value: string | number, symbol?: string}> = ({ label, value, symbol }) => (
  <p className="info-label">
    <span className="value-part">
      {value}
      <span className="symbol-part">{symbol}</span>
    </span>
    <span className="label-part">{label}</span>
  </p>
);

export default InfoLabel;
