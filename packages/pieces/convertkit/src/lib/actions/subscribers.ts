import { createAction } from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpMethod,
  HttpRequest,
} from '@activepieces/pieces-common';
import { Subscriber } from '../common/models';
import { convertkitAuth } from '../..';
import {
  subscriberId,
  API_ENDPOINT,
  fetchSubscriperById,
  fetchSubscriberByEmail,
  fetchSubscribedTags,
  emailAddress,
  emailAddressRequired,
  page,
  firstName,
  from,
  to,
  updatedFrom,
  updatedTo,
  sortOrder,
  sortField,
} from '../common/subscribers';
import { allFields } from '../common/custom-fields';
import { CONVERTKIT_API_URL } from '../common/constants';

export const getSubscriberById = createAction({
  auth: convertkitAuth,
  name: 'subscribers_get_subscriber_by_id',
  displayName: 'Subscriber: Get Subscriber By Id',
  description: 'Returns data for a single subscriber',
  props: {
    subscriberId,
  },
  async run(context) {
    const { subscriberId } = context.propsValue;
    return fetchSubscriperById(context.auth, subscriberId);
  },
});

export const getSubscriberByEmail = createAction({
  auth: convertkitAuth,
  name: 'subscribers_get_subscriber_by_email',
  displayName: 'Subscriber: Get Subscriber By Email',
  description: 'Returns data for a single subscriber',
  props: {
    email_address: emailAddressRequired,
  },
  async run(context) {
    const { email_address } = context.propsValue;
    return fetchSubscriberByEmail(context.auth, email_address);
  },
});

export const listSubscribers = createAction({
  auth: convertkitAuth,
  name: 'subscribers_list_subscribers',
  displayName: 'Subscriber: List Subscribers',
  description: 'Returns a list of all subscribers',
  props: {
    page,
    sortOrder,
    sortField,
    from,
    to,
    updatedFrom,
    updatedTo,
    emailAddress,
  },
  async run(context) {
    const {
      page,
      from,
      to,
      updatedFrom,
      updatedTo,
      emailAddress,
      sortOrder,
      sortField,
    } = context.propsValue;

    // build the url
    const url = `${CONVERTKIT_API_URL}/${API_ENDPOINT}`;

    const body = {
      api_secret: context.auth,
      page,
      from,
      to,
      updated_from: updatedFrom,
      updated_to: updatedTo,
      email_address: emailAddress,
      sort_order: sortOrder,
      sort_field: sortField,
    };

    const request: HttpRequest = {
      url,
      method: HttpMethod.GET,
      body,
    };

    const response = await httpClient.sendRequest<{
      subscribers: Subscriber[];
    }>(request);

    if (response.status !== 200) {
      throw new Error(`Error fetching subscribers: ${response.status}`);
    }

    return response.body.subscribers;
  },
});

export const updateSubscriber = createAction({
  auth: convertkitAuth,
  name: 'subscribers_update_subscriber',
  displayName: 'Subscriber: Update Subscriber',
  description: 'Update a subscriber',
  props: {
    subscriberId,
    emailAddress,
    firstName,
    fields: allFields,
  },
  async run(context) {
    const { subscriberId, emailAddress, firstName, fields } =
      context.propsValue;

    const url = `${CONVERTKIT_API_URL}/${API_ENDPOINT}/${subscriberId}`;
    const body = {
      api_secret: context.auth,
      email_address: emailAddress,
      first_name: firstName,
      fields,
    };

    const request: HttpRequest = {
      url,
      method: HttpMethod.PUT,
      body,
    };

    const response = await httpClient.sendRequest<{ subscriber: Subscriber }>(
      request
    );

    if (response.status !== 200) {
      throw new Error(`Error updating subscriber: ${response.status}`);
    }

    return response.body.subscriber;
  },
});

export const unsubscribeSubscriber = createAction({
  auth: convertkitAuth,
  name: 'subscribers_unsubscribe_subscriber',
  displayName: 'Subscriber: Unsubscribe Subscriber',
  description: 'Unsubscribe a subscriber',
  props: {
    email: emailAddressRequired,
  },
  async run(context) {
    const { email } = context.propsValue;
    const url = `${CONVERTKIT_API_URL}/unsubscribe`;

    const body = { email, api_secret: context.auth };

    const request: HttpRequest = {
      url,
      method: HttpMethod.PUT,
      body,
    };

    const response = await httpClient.sendRequest<{
      subscriber: Subscriber;
    }>(request);

    if (response.status !== 200) {
      throw new Error(`Error unsubscribing subscriber: ${response.status}`);
    }

    return response.body.subscriber;
  },
});

export const listTagsBySubscriberId = createAction({
  auth: convertkitAuth,
  name: 'subscribers_list_tags_by_subscriber_id',
  displayName: 'Subscriber: List Tags By Subscriber Id',
  description: 'Returns a list of all subscribed tags',
  props: {
    subscriberId,
  },
  async run(context) {
    const { subscriberId } = context.propsValue;
    return fetchSubscribedTags(context.auth, subscriberId);
  },
});

export const listSubscriberTagsByEmail = createAction({
  auth: convertkitAuth,
  name: 'subscribers_list_tags_by_email',
  displayName: 'Subscriber: List Tags By Email',
  description: 'Returns a list of all subscribed tags',
  props: {
    email_address: emailAddressRequired,
  },
  async run(context) {
    const { email_address } = context.propsValue;
    const subscriberId = await fetchSubscriberByEmail(
      context.auth,
      email_address
    );
    return fetchSubscribedTags(context.auth, subscriberId.id);
  },
});
