import DropDownButton from "../Shared/DropDownButton/DropDownButton"
import './DropDownCast.scss'

interface DropDownCastProps {
  category: string
  isOpen: boolean
  onToggle: () => void
  count: number
  children: React.ReactNode
}

const DropDownCast: React.FC<DropDownCastProps> = ({
  category, isOpen, onToggle, count, children,
}) => (
  <div key={`cast-dropdown-${category}`}>
    <div className="cast-dropdown category-item-title ion-flex ion-justify-content-between ion-padding-start" onClick={onToggle}>
      <p className="ion-flex ion-align-items-center">
        {`${category} (${count})`}
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

export default DropDownCast