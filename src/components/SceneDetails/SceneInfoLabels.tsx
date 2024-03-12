interface SceneInfoLabelsProps {
  info: string;
  title: string;
}

const SceneInfoLabels: React.FC<SceneInfoLabelsProps> = ({ info, title }) => {
  return (
    <div className='ion-flex-column' style={{textAlign: 'center', height: '100%', justifyContent: 'space-around'}}>
      <p className='ion-no-margin' style={{fontSize: '18px'}}><b>{info.toUpperCase()}</b></p>
      <p className='ion-no-margin' style={{fontSize: '12px', margin: '6px'}}>{title.toUpperCase()}</p>
    </div>
  )
}

export default SceneInfoLabels