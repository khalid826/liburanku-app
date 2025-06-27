const PaymentProof = ({ onUpload }) => (
  <div className="p-4 bg-gray-50 rounded shadow">
    <h2 className="text-lg font-semibold mb-2">Upload Payment Proof</h2>
    {/* Add upload field here */}
    <input type="file" className="mb-2" />
    <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={onUpload}>Upload</button>
  </div>
);

export default PaymentProof;
