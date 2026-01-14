import ErrorPage from '@/components/error/ErrorPage';

export const metadata = {
  title: '503 - Szolgáltatás ideiglenesen nem elérhető | MATRIX CBS',
  description: 'A szolgáltatás jelenleg karbantartás vagy túlterhelés miatt nem elérhető.',
};

export default function ServiceUnavailable() {
  return (
    <ErrorPage
      code={503}
      title="Szolgáltatás ideiglenesen nem elérhető"
      message="A szolgáltatás jelenleg karbantartás vagy túlterhelés miatt nem elérhető. Kérjük, próbálja újra néhány perc múlva."
      showHomeButton={true}
    />
  );
}
