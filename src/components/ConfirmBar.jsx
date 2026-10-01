// Small inline "are you sure?" row used for delete and reset.
export default function ConfirmBar({ message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="confirm" role="alertdialog" aria-label={message}>
      <p>{message}</p>
      <div className="actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="button" className="danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  );
}
