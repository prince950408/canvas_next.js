import React, { useEffect, useContext } from 'react';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { decodeBase64Url } from '../utils/base64';
import Validator from '../utils/validator';
import PreviewContext, {
  CardType,
  PreviewDispatch
} from '../components/PreviewContext';

const validator = Validator();

type CardGenPagePropsData = {
  imageUrl?: string;
  cardType?: CardType;
  title?: string;
  description?: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data: CardGenPagePropsData = {
      imageUrl: decodeBase64Url((context.query?.imageUrl as string) || ''),
      title: decodeBase64Url((context.query?.title as string) || ''),
      description: decodeBase64Url((context.query?.description as string) || '')
    };
    const cardTypeText = decodeBase64Url(
      (context.query?.cardType as string) || ''
    );
    data.cardType =
      cardTypeText === 'summary_large_image' || cardTypeText === 'summary'
        ? cardTypeText
        : 'summary_large_image';
    return { props: { data: data } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

const CardGenPage = ({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);

  const dataImageUrlErr = validator.assets(
    data.imageUrl,
    previewStateContext.validateAssets,
    previewStateContext.assets,
    true
  );

  useEffect(() => {
    if (dataImageUrlErr === undefined) {
      previewDispatch({
        type: 'resetPreviewSet',
        payload: []
      });
      previewDispatch({
        type: 'setImageBaseUrl',
        payload: ['recv', data.imageUrl]
      });
    }
  }, [previewDispatch, dataImageUrlErr, data.imageUrl]);

  useEffect(() => {
    previewDispatch({
      type: 'setCard',
      payload: [data.cardType, data.title, data.description]
    });
  }, [previewDispatch, data.cardType, data.title, data.description]);

  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <Head>
      <title>redirecting...</title>
      <meta
        name="og:description"
        content={
          dataImageUrlErr === undefined
            ? data.description || '[preview] description'
            : dataImageUrlErr.message
        }
      />
      <meta
        property="og:image"
        content={dataImageUrlErr === undefined ? data.imageUrl : ''}
      />
      <meta name="og:title" content={data.title || '[preview] title'} />
      <meta
        name="twitter:card"
        content={data.cardType || 'summary_large_image'}
      />
    </Head>
  );
};
export default CardGenPage;
