import useSWR from 'swr';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { HiExternalLink } from 'react-icons/hi';

import { fetcher, getInfo } from '@/lib/api';
import { IINfo } from '@/lib/types/notion';
import { formatRichText } from '@/lib/helper/formatRichText';
import { Page } from '@/components/Page';
import { Seo } from '@/components/Seo';
import { Loader } from '@/components/ui/Loader';
import { ErrorPage } from '@/components/ErrorPage';

export const getStaticProps: GetStaticProps = async () => {
  try {
    const data = await getInfo();
    console.log(data)
    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {},
  }
}

interface IProps {
  data?: IINfo;
}

const Home: NextPage<IProps> = ({ data: initialData }) => {
  const { data, error } = useSWR<IINfo>('/api/info', fetcher, { fallbackData: initialData });

  if (error) return <ErrorPage error={error} />;
  if (!data) return <Loader className="min-h-full" />;

  return (
    <>
      <Seo/>
      <Page className="flex items-center justify-center">
        <div className="p-4 flex flex-col justify-center gap-4 lg:flex-row">
          {data.profile_picture && (
            <div className="flex-1">
              <Image
                alt={`${data.name?.[0]?.plain_text}'s profile picture`}
                src={data.profile_picture}
                className="image grayscale"
                height={400}
                width={300}
                objectFit="cover"
              />
            </div>
          )}

          <div className="flex-1 max-w-lg my-auto">
            <h1 className="my-2 text-5xl font-bold font-serif text-gray-900">
              {data.name ? formatRichText(data.name) : 'Hello 👋'}
            </h1>
            <p className="my-1 text-sm text-gray-700">{formatRichText(data.headline)}</p>
            <p className="mt-4 mb-0 text-base text-gray-900"><b>{formatRichText(data.salutation)}</b></p>
            {data.description && (
              <p className="mt-0 mb-4 text-base text-gray-900 text-justify">
                {formatRichText(data.description)}
              </p>
            )}

            {Object.keys(data.links || {}).length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                {Object.keys(data.links).map((link_description) => {
                  const content = data.links[link_description][0];
                  if (!content) return;

                  return (
                    <li key={content.plain_text}>
                      <a href={link_description.toLowerCase() === 'email' ? `mailto:${content.plain_text}` : content.plain_text || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center underline underline-offset-2 decoration-2 text-gray-700 cursor-pointer">
                        {link_description}
                        <HiExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {data.copyright && (
              <p className="mt-12 text-sm text-gray-700">
                {formatRichText(data.copyright)}
              </p>
            )}
          </div>
        </div>
      </Page>
    </>
  );
}

export default Home
