import { useState } from 'react';

const defaultValues = {
  title: '',
  description: '',
  imageUrl: '',
  terms_condition: '',
  promo_code: '',
  promo_discount_price: '',
  minimum_claim_price: '',
};

const PromoForm = ({ initialValues = {}, onSubmit, loading }) => {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!values.title) errs.title = 'Title is required';
    if (!values.promo_code) errs.promo_code = 'Promo code is required';
    if (!values.promo_discount_price) errs.promo_discount_price = 'Discount is required';
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
      <h2 className="text-lg font-semibold mb-2">{initialValues.id ? 'Edit' : 'Add'} Promo</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input name="title" value={values.title} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        {errors.title && <div className="text-xs text-red-500 mt-1">{errors.title}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" value={values.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input name="imageUrl" value={values.imageUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Terms & Condition (HTML allowed)</label>
        <textarea name="terms_condition" value={values.terms_condition} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Promo Code *</label>
        <input name="promo_code" value={values.promo_code} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        {errors.promo_code && <div className="text-xs text-red-500 mt-1">{errors.promo_code}</div>}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Discount Amount *</label>
          <input name="promo_discount_price" type="number" value={values.promo_discount_price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          {errors.promo_discount_price && <div className="text-xs text-red-500 mt-1">{errors.promo_discount_price}</div>}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Minimum Claim Price</label>
          <input name="minimum_claim_price" type="number" value={values.minimum_claim_price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded font-semibold min-w-[100px]" disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default PromoForm;
