import ErrorPage from '@/components/error/ErrorPage';

export const metadata = {
  title: '403 - Hozzáférés megtagadva | MATRIX CBS',
  description: 'Nincs jogosultsága a tartalom megtekintéséhez.',
};

export default function Forbidden() {
  return (
    <ErrorPage
      code={403}
      title="Hozzáférés megtagadva"
      message="Nincs jogosultsága az oldal megtekintéséhez. Ha úgy gondolja, hogy ez hiba, kérjük, lépjen kapcsolatba az ügyfélszolgálattal."
      showHomeButton={true}
    />
  );
}
