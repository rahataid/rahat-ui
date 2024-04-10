'use server';

import { useSettingsStore } from '@rahat-ui/query';
import axios from 'axios';

export async function fetchChainSettingsNet() {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_HOST_URL + '/v1/settings/CHAIN_SETTINGS_NET',
    );
    // useSettingsStore.getState().setChainSettings(response.data?.data?.value);
    // useSettingsStore.setState({
    //   chainSettings: response.data?.value,
    // });
    return response.data?.data?.value;
  } catch (error) {
    // Handle error
    console.error('Error fetching chain settings:', error);
    throw error;
  }
}
