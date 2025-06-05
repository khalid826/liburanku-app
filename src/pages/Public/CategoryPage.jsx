import { useEffect, useState as useStateCategory } from 'react'; // Aliased useState
import { useParams, Link as RouterLinkCategory } from 'react-router-dom'; // Aliased Link
import { activityService, categoryService as categoryServicePage } from '../../api'; // Aliased categoryService
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ActivityCard from '../../components/Activity/ActivityCard'; // New component
import { ArrowLeft, Tag as TagIcon } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [activities, setActivities] = useStateCategory([]);
  const [category, setCategory] = useStateCategory(null);
  const [loading, setLoading] = useStateCategory(true);
  const [error, setError] = useStateCategory(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch category details (for name, etc.)
        const categoryResponse = await categoryServicePage.getCategoryById(categoryId);
        if (categoryResponse && categoryResponse.data) {
          setCategory(categoryResponse.data);
        } else {
          throw new Error("Category not found.");
        }

        // Fetch activities for this category
        const activitiesResponse = await activityService.getActivitiesByCategoryId(categoryId);
        if (activitiesResponse && activitiesResponse.data) {
          setActivities(activitiesResponse.data);
        } else {
          setActivities([]);
        }
      } catch (err) {
        setError(err.message || `Failed to load data for category ${categoryId}.`);
        setActivities([]);
        if (!category) setError("Category not found or failed to load."); // More specific error if category fetch failed
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId]);

  if (loading) return <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"><Loader /></div>;
  if (error && !activities.length) return ( // Show error prominently if no activities and error exists
    <div className="container mx-auto py-8 text-center">
        <ErrorMessage message={error} onClose={() => setError(null)} />
        <RouterLinkCategory to="/" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <ArrowLeft size={18} className="mr-2" /> Go Back Home
        </RouterLinkCategory>
    </div>
  );


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <RouterLinkCategory to="/" className="text-blue-600 hover:underline inline-flex items-center mb-4">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </RouterLinkCategory>
        {category ? (
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center justify-center">
                <TagIcon size={30} className="mr-3 text-blue-500" /> Activities in {category.name}
            </h1>
        ) : (
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Category Activities</h1>
        )}
      </div>
      
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />} {/* Show error even if some activities might be there from a partial success */}

      {activities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        !loading && !error && <p className="text-center text-gray-500 text-lg">No activities found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;