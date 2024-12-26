'use server';
import { getAuthToken } from '@/utils/auth-actions';
import {
  ErrorResponse,
  reraDetailsResponse,
  promoterDetailsResponse,
  planDetailResponse,
  caDetailsResponse,
  engineerDetailsResponse,
  allotmentDetailsResponse,
  lawyerDetailsResponse,
  contactDetailsResponse,
} from './types';
import { error } from 'console';

export const ApiCall = async (url: string, templateName: string) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.SERVER_URL}/${url}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errData = (await response.json()) as ErrorResponse;
      return {
        error: true,
        message: errData.detail,
        data: null,
      };
    }
    let data;

    //fetching data according to the response
    switch (templateName) {
      case 'reraDetails':
        data = (await response.json()) as reraDetailsResponse;
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      case 'promoterDetails':
        data = (await response.json()) as promoterDetailsResponse;
        console.log(data);
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      case 'financialTargets':
        //financialTargets api not working
        //error response sometimes it comes as details and sometimes it comes as error in respnose
        //add a response type
        data = await response.json();
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      case 'planDetails':
        data = (await response.json()) as planDetailResponse;
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      case 'caDetails':
        data = (await response.json()) as caDetailsResponse;
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      case 'architectDetails':
        //architectDetails api not working
        //error response sometimes it comes as details and sometimes it comes as error in respnose
        //add a response type
        data = await response.json();
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      case 'engineerDetails':
        data = (await response.json()) as engineerDetailsResponse;
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      case 'allotmentDetails':
        data = (await response.json()) as allotmentDetailsResponse;
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      case 'lawyerDetails':
        data = (await response.json()) as lawyerDetailsResponse;
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      case 'contactDetails':
        data = (await response.json()) as contactDetailsResponse;
        return {
          error: false,
          message: 'Data fetched successfully!',
          data,
        };
        break;
      default:
        return {
          error: true,
          message: 'Invalid template',
          data: null,
        };
        break;
    }
  } catch (error) {
    return {
      error: true,
      message: 'Something went wrong. Please try again',
      data: null,
    };
  }
};
