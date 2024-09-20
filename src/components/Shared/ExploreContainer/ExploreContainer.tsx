import './ExploreContainer.css';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => (
  <div className="container">
    <strong>{name}</strong>
  </div>
);

export default ExploreContainer;
