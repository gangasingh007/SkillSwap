export default function ProfilePage({ params }: { params: { userId: string } }) {
  return <div>User Profile: {params.userId}</div>;
}
