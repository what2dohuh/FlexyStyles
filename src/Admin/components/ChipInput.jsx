import '../styles/Dashboard.css';

const ChipInput = ({ label, value, onChange, onAdd, items, onRemove, placeholder }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAdd();
    }
  };

  return (
    <div className="adm-form-group">
      <label className="adm-label">{label}</label>
      <div className="adm-chip-input">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="adm-input"
          placeholder={placeholder}
        />
        <button onClick={onAdd} className="adm-btn adm-btn-add-chip">Add</button>
      </div>
      <div className="adm-chips">
        {items.map((item, idx) => (
          <span key={idx} className="adm-chip">
            {item}
            <button onClick={() => onRemove(idx)} className="adm-chip-remove">×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChipInput;