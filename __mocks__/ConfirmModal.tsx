
const ConfirmModal = () => ({ open, onConfirm, onCancel, message }) => (
  open ? <div data-testid="confirm-modal" onClick={onConfirm}>{message}</div> : null
);

export default ConfirmModal;