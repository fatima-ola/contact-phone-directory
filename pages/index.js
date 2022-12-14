import Head from "next/head";
import { useState } from "react";
import LandingPage from "../components/LandingPage";
import { getXataClient } from "../src/xata";
import SearchList from "../components/SearchList/SearchList";
import AllContactsList from "../components/AllContactsLists/AllContactsLists";

export default function Home({ phoneBooks }) {
  const [searchWord, setSearchWord] = useState();
  const [searchContacts, setSearchContacts] = useState();


  const handleSearch = async (e) => {
    e.preventDefault();
    const result = await fetch("/api/search-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchWord,
      }),
    }).then((r) => r.json());
    setSearchContacts(result);
  };

  return (
    <div>
      <Head>
        <title>Contacts Phone Directory</title>
        <meta name='description' content='Job board app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <LandingPage>
        <div className='flex justify-center mb-4'>
          <input
            className='placeholder:italic placeholder:text-slate-400 block bg-white w-[50%] border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
            placeholder='Search for contact...'
            type='text'
            onChange={(e) => setSearchWord(e.target.value)}
          />
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            type='submit'
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {searchContacts ? <SearchList allContacts={searchContacts} /> : ""}
        {searchContacts ? "" : <AllContactsList allContacts={phoneBooks} />}
      </LandingPage>
    </div>
  );
}

export async function getServerSideProps() {
  const xata = getXataClient();
  const phoneBooks = await xata.db.contacts.getAll();
  return { props: { phoneBooks } };
}
