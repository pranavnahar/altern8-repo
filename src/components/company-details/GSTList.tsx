import React, { useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MultiSelect } from '../../components/ui/multi-select';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '../../components/ui/table';
import { useGetGstList } from './use-gst-gstlist';
import { Button } from '../../components/ui/button';
import { apiUrl, getAccessToken } from '../../utils/auth';
import { parseCookies } from 'nookies';
import { useToast } from '../../utils/show-toasts';
import { useRouter } from 'next/navigation';

const GSTList = () => {
  const [loadingSpinner,setLoadingSpinner] = useState(false);
  const { gstList, message } = useGetGstList();
  const [currentGstin, setCurrentGstin] = useState('');
  console.log(currentGstin);
  const [selectedGstin, setSelectedGstin] = useState<string[]>();
  const [formData, setFormData] = useState({
    gstin: '',
  });
  const router = useRouter()
  const {showToast }= useToast()

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setCurrentGstin(value);
  };

  const handleGstinChange = (selectedValues: string[]) => {
    setSelectedGstin(selectedValues);
    handleSelectChange({
      //@ts-expect-error target types
      target: {
        name: 'currentGstin',
        value: selectedValues[0] || '',
      },
    });
  };

  let accessToken = parseCookies().accessToken;

  const ReplaceTokenOrRedirect = async () => {
    // get new access token with help of Refresh token
    const token = await getAccessToken();
    // if not able to get the token then redirect to login
    if (!token) {
      router.push('/login');
    } else {
      accessToken = token;
    }
  };


  const handleSubmitGstin = async () => {   if (formData.gstin.length < 10) {
    showToast({
      message: 'Please type a correct GSTIN number',
      type: 'info'
    });
    return;
  }

  // submitting the data to backend
  try {
    // Set loading to true when starting the fetch
    setLoadingSpinner(true);

    let body = formData
    // console.log(body);
    let response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-account/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      await ReplaceTokenOrRedirect();
      // Again try to fetch the data
      response = await fetch(`${apiUrl}/user-dashboard-api/change-primary-account/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(body),
      });
    }

    if (response.ok) {
      await response.json();
      showToast({
        message: 'Successsfully updated GSTIN',
        type: 'success'
      });
      console.log('GSTIN updated successfully');
    } else {
      await response.json();
      showToast({
        message: 'Failed to update GSTIN',
        type: 'error'
      });
    }
  } catch (error) {
    showToast({
      message: 'Server Connection Error updating GSTIN',
      type: 'error'
    });
  } finally {
    setLoadingSpinner(false);
  }};

  const handleAddGstinInputChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

  };

  const gstinOptions = [...gstList.map(gstin => ({ label: gstin, value: gstin }))];

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {loadingSpinner && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-50">
          <LoadingSpinner />
        </div>
      )}

      <div className="mb-5 rounded-lg">
        <h1 className="mb-3 text-lg font-medium tracking-tight text-center text-gray-200">
          GST Number List
        </h1>

        {message === 'GST list fetched successfully' ? (
          <>
            <div className="mt-3">
              <h3 className="text-base font-medium leading-8 text-gray-300">
                Already registered GST numbers:
              </h3>
              <Table className="my-2">
                <TableHeader className="card-cover">
                  <TableRow>
                    <TableCell className="text-gray-200">S.No.</TableCell>
                    <TableCell className="text-gray-200">GSTIN</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-b border-neutral-50/20">
                  {gstList.map((gstin: string, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="text-gray-200">{index + 1}</TableCell>
                      <TableCell className="text-gray-200">{gstin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="h-6 mt-8 text-base font-medium leading-8 text-gray-300">
              Select a GST Number to proceed with it:
            </div>
            <MultiSelect
              options={gstinOptions}
              onValueChange={handleGstinChange}
              defaultValue={selectedGstin}
              placeholder="Select GST Number"
              className="w-full py-1 mt-5 text-gray-100 transition-colors bg-transparent outline-none focus:outline-none focus:border-purple-600"
              variant="default"
            />
          </>
        ) : (
          <Table className="my-2">
            <TableHeader className="card-cover">
              <TableRow>
                <TableCell className="text-gray-200">S.No.</TableCell>
                <TableCell className="text-gray-200">GSTIN</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="border-b border-neutral-50/20">
              <TableRow>
                <TableCell className="text-gray-200">-</TableCell>
                <TableCell className="text-gray-200">No Gst Available for this user</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        <div className="flex justify-center pt-5">
          <Button
            onClick={handleSubmitGstin}
            className="text-white rounded hover:bg-white/10 animation bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
            type="submit"
            disabled={message !== 'GST list fetched successfully'}
          >
            Proceed
          </Button>
        </div>

        <div className="h-6 mt-5 text-base font-medium leading-8 text-gray-300">
          Add a new GSTIN Number:
        </div>
        <div className="flex-1 w-full">
          <div className="flex py-1 my-2">
            <input
              onChange={handleAddGstinInputChange}
              value={formData.gstin || ''}
              name="gstin"
              placeholder="GSTIN Number"
              className="w-full py-1 text-gray-200 capitalize transition-colors bg-transparent border-b-2 outline-none focus:outline-none focus:border-purple-600 placeholder:text-sm"
              type="text"
              required
            />
          </div>
        </div>

        <div className="flex justify-center pt-5">
          <Button
            onClick={handleSubmitGstin}
            className="text-white rounded bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 hover:bg-white/10"
            type="submit"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GSTList;
function showToast(arg0: { message: string; type: string; }) {
  throw new Error('Function not implemented.');
}

