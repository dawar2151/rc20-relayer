
import config from '../config';
/**
 * save connected Metamask account address
 */
export async function send_transaction(data, safe) {
  const body = data
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
  const response = await fetch(config.relayer_api+"/vi/safes/"+safe+"/transactions/", requestOptions);
  return response;
}