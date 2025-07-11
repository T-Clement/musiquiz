export default function Modal({ open, onClose, children }) {
  // if (!open) return null;

  return (
    // backdrop of the modal
    <div
      onClick={onClose}
      // className={`fixed inset-0 flex justify-center items-center transition-colors z-20 ${
      className={`fixed inset-0 flex justify-center items-center transition-colors z-20 ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-6 transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover;bg-gray-50 hover:text-gray-600"
        >
          X
        </button>
        {/* Modal content */}
        {children}
      </div>
    </div>
  );
}
