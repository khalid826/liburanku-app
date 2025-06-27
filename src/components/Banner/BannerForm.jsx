import { useState } from 'react';

const defaultValues = {
  name: '',
  imageUrl: '',
};

const BannerForm = ({ initialValues = {}, onSubmit, loading }) => {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!values.name) errs.name = 'Name is required';
    if (!values.imageUrl) errs.imageUrl = 'Image URL is required';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0 && onSubmit) {
      onSubmit({ ...values });
    }
  };

  return (
    <form className="space-y-4 p-4 bg-white rounded shadow max-w-lg mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-2">{initialValues.id ? 'Edit' : 'Add'} Banner</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input name="name" value={values.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URL *</label>
        <input name="imageUrl" value={values.imageUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        {errors.imageUrl && <div className="text-xs text-red-500 mt-1">{errors.imageUrl}</div>}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold min-w-[100px]" disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default BannerForm;
