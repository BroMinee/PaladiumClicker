import { useRouter } from 'next/router'

export default function FriendsPage() {
  const router = useRouter()
  return <p className="text-red-500">Amis de : {router.query.slug}</p>
}