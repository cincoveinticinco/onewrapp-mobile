import DropDownButton from '../Shared/DropDownButton/DropDownButton';
import HighlightedText from '../Shared/HighlightedText/HighlightedText';
import './DropDownCast.scss';

interface DropDownCastProps {
  category: string
  isOpen: boolean
  onToggle: () => void
  count: number
  children: React.ReactNode
  searchTerm?: string
}

const DropDownCast: React.FC<DropDownCastProps> = ({
  category, isOpen, onToggle, count, children, searchTerm,
}) => (
  <div key={`cast-dropdown-${category}`}>
    <div className="cast-dropdown category-item-title ion-flex ion-justify-content-between ion-padding-start" onClick={onToggle}>
      <p className="ion-flex ion-align-items-center">
        <HighlightedText text={`${category} (${count})`} searchTerm={searchTerm || ''} />
      </p>
      <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
        <DropDownButton open={isOpen} />
      </div>
    </div>
    {isOpen && (
      <div style={{ margin: '0px 0px' }} className="cast-cards-wrapper ion-content-scroll-host">
        {children}
      </div>
    )}
  </div>
);

export default DropDownCast;
