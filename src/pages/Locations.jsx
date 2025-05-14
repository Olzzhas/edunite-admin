import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations, createLocation, updateLocation, deleteLocation } from "../store/slices/locationSlice";
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiMapPin, FiUsers } from "react-icons/fi";
import { formatTimestamp } from "../utils/dateUtils";
import AddLocationModal from "../components/modals/AddLocationModal";
import EditLocationModal from "../components/modals/EditLocationModal";
import Pagination from "../components/common/Pagination";
import { useAlertDialog } from "../contexts/AlertDialogContext";

const Locations = () => {
   const dispatch = useDispatch();
   const { locations, totalElements, totalPages, currentPage, pageSize, loading, error } = useSelector(
      (state) => state.locations
   );
   const { deleteConfirm, success, info } = useAlertDialog();

   const [searchTerm, setSearchTerm] = useState("");
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [selectedLocation, setSelectedLocation] = useState(null);

   // Load locations on component mount
   useEffect(() => {
      dispatch(fetchLocations({ page: 1, size: 10 }));
   }, [dispatch]);

   // Handle page change
   const handlePageChange = (page) => {
      dispatch(fetchLocations({ page, size: pageSize }));
   };

   // Handle search
   const handleSearch = (e) => {
      e.preventDefault();
      // In a real implementation, we would pass the search term to the API
      dispatch(fetchLocations({ page: 1, size: pageSize }));
   };

   // Open add modal
   const handleOpenAddModal = () => {
      setIsAddModalOpen(true);
   };

   // Close add modal
   const handleCloseAddModal = () => {
      setIsAddModalOpen(false);
   };

   // Open edit modal
   const handleOpenEditModal = (location) => {
      setSelectedLocation(location);
      setIsEditModalOpen(true);
   };

   // Close edit modal
   const handleCloseEditModal = () => {
      setSelectedLocation(null);
      setIsEditModalOpen(false);
   };

   // Handle add location
   const handleAddLocation = async (locationData) => {
      try {
         await dispatch(createLocation(locationData)).unwrap();
         dispatch(fetchLocations({ page: 1, size: pageSize }));
         success({
            title: "Success",
            message: "Location added successfully",
            onConfirm: () => {
               // Refresh the locations list
               dispatch(fetchLocations({ page: 1, size: pageSize }));
            },
         });
      } catch (error) {
         info({
            title: "Error",
            message: error.message || "Failed to add location",
         });
         throw error;
      }
   };

   // Handle update location
   const handleUpdateLocation = async (id, locationData) => {
      try {
         await dispatch(updateLocation({ id, locationData })).unwrap();
         dispatch(fetchLocations({ page: currentPage, size: pageSize }));
         success({
            title: "Success",
            message: "Location updated successfully",
         });
      } catch (error) {
         info({
            title: "Error",
            message: error.message || "Failed to update location",
         });
         throw error;
      }
   };

   // Handle delete location
   const handleDeleteLocation = (id, name) => {
      deleteConfirm({
         title: "Delete Location",
         message: `Are you sure you want to delete the location "${name}"? This action cannot be undone.`,
         onConfirm: async () => {
            try {
               await dispatch(deleteLocation(id)).unwrap();
               dispatch(fetchLocations({ page: currentPage, size: pageSize }));
               success({
                  title: "Success",
                  message: "Location deleted successfully",
               });
            } catch (error) {
               info({
                  title: "Error",
                  message: error.message || "Failed to delete location",
               });
            }
         },
      });
   };

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Locations</h1>
            <button
               onClick={handleOpenAddModal}
               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
               <FiPlus className="mr-2" /> Add Location
            </button>
         </div>

         <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-4 border-b border-gray-200">
               <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-grow">
                     <input
                        type="text"
                        placeholder="Search locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                     />
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                     </div>
                  </div>
                  <button
                     type="submit"
                     className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                     Search
                  </button>
               </form>
            </div>

            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th
                           scope="col"
                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Location
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Description
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Capacity
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Created At
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {loading ? (
                        <tr>
                           <td colSpan="5" className="px-6 py-4 text-center">
                              <div className="flex justify-center">
                                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                              </div>
                           </td>
                        </tr>
                     ) : error ? (
                        <tr>
                           <td colSpan="5" className="px-6 py-4 text-center text-red-500">
                              {error}
                           </td>
                        </tr>
                     ) : locations.length === 0 ? (
                        <tr>
                           <td colSpan="5" className="px-6 py-4 text-center">
                              No locations found
                           </td>
                        </tr>
                     ) : (
                        locations.map((location) => (
                           <tr key={location.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                       <FiMapPin size={18} />
                                    </div>
                                    <div className="ml-4">
                                       <div className="text-sm font-medium text-gray-900">{location.name}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="text-sm text-gray-900 max-w-xs truncate">
                                    {location.description || "No description"}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center">
                                    <FiUsers className="mr-2 text-gray-500" />
                                    <span className="text-sm text-gray-900">{location.capacity}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="text-sm text-gray-500">
                                    {location.created_at ? formatTimestamp(location.created_at) : "N/A"}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                 <button
                                    onClick={() => handleOpenEditModal(location)}
                                    className="text-primary-600 hover:text-primary-900 mr-4"
                                 >
                                    <FiEdit size={18} />
                                 </button>
                                 <button
                                    onClick={() => handleDeleteLocation(location.id, location.name)}
                                    className="text-red-600 hover:text-red-900"
                                 >
                                    <FiTrash2 size={18} />
                                 </button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            {totalPages > 1 && (
               <div className="px-6 py-4 border-t border-gray-200">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
               </div>
            )}
         </div>

         {/* Add Location Modal */}
         <AddLocationModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSubmit={handleAddLocation} />

         {/* Edit Location Modal */}
         <EditLocationModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSubmit={handleUpdateLocation}
            location={selectedLocation}
         />
      </div>
   );
};

export default Locations;
