import { IScrappingService } from '@/api/interfaces/IScrappingService';
import { useEffect } from 'react';

interface IProps {
  instance: IScrappingService;
  updateLoading(state: boolean): void;
}

export function LibraryScrapperTab(props: IProps) {
  useEffect(() => {
    props.updateLoading(true);

    setTimeout(() => {
      props.updateLoading(false);
    }, 3000);
  }, []);

  return <></>;
}
