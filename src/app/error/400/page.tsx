import ErrorPage from '@/components/error/ErrorPage';

export const metadata = {
  title: '400 - Hibás kérés | MATRIX CBS',
  description: 'A kérés hibás vagy érvénytelen.',
};

export default function BadRequest() {
  return (
    <ErrorPage
      code={400}
      title="Hibás kérés"
      message="A kérés nem feldolgozható érvénytelen vagy hiányos adatok miatt. Kérjük, ellenőrizze a megadott adatokat és próbálja újra."
      showHomeButton={true}
    />
  );
}
