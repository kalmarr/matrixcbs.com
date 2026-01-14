import ErrorPage from '@/components/error/ErrorPage';

export const metadata = {
  title: '429 - Túl sok kérés | MATRIX CBS',
  description: 'Túl sok kérést küldött rövid időn belül.',
};

export default function TooManyRequests() {
  return (
    <ErrorPage
      code={429}
      title="Túl sok kérés"
      message="Túl sok kérést küldött rövid időn belül. Kérjük, várjon néhány percet, majd próbálja újra."
      showHomeButton={true}
    />
  );
}
