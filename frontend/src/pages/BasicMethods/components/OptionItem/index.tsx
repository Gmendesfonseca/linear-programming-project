import './styles.css';

interface OptionsProps {
  title: string;
  checked: boolean;
  handleClick: () => void;
}

export const OptionItem = ({ title, checked, handleClick }: OptionsProps) => {
  return (
    <>
      <input
        className="option-item"
        type="checkbox"
        id="problem-definition"
        onClick={handleClick}
        checked={checked}
      />
      <label>{title}</label>
    </>
  );
};
