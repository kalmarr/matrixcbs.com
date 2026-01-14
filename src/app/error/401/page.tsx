import ErrorPage from '@/components/error/ErrorPage';

export const metadata = {
  title: '401 - Hitelesítés szükséges | MATRIX CBS',
  description: 'Hitelesítés szükséges a tartalom eléréséhez.',
};

export default function Unauthorized() {
  return (
    <ErrorPage
      code={401}
      title="Hitelesítés szükséges"
      message="A tartalom megtekintéséhez be kell jelentkeznie. Kérjük, jelentkezzen be a folytatáshoz vagy térjen vissza a főoldalra."
      showHomeButton={true}
    />
  );
}
