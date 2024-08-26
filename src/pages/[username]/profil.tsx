import { useRouter } from "next/router";

export default function ProfilPage({params}) {

  const router = useRouter();
  const { username } = router.query;
  return <>
    <p>Profil de : {username}</p>
    <p>Profil serveur side de : {params.username_context}</p>
    </>
}

export async function getServerSideProps({params}) {
  console.log(params.username)
  return {
    props: {
      params: { username_context: params.username + " (from getServerSideProps)"}
    }
  }
}

