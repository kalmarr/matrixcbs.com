import ErrorPage from '@/components/error/ErrorPage';

export const metadata = {
  title: '404 - Az oldal nem található | MATRIX CBS',
  description: 'A keresett oldal nem található.',
};

export default function NotFound() {
  return (
    <ErrorPage
      code={404}
      title="Az oldal nem található"
      message="A keresett oldal nem létezik vagy áthelyezésre került. Kérjük, ellenőrizze a webcímet vagy térjen vissza a főoldalra."
      showHomeButton={true}
    />
  );
}
