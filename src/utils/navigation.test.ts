import { router } from 'expo-router';
import { goBack } from './navigation';

jest.mock('expo-router', () => ({
  router: {
    canGoBack: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

const mockedRouter = router as unknown as { canGoBack: jest.Mock; back: jest.Mock; replace: jest.Mock };

beforeEach(() => {
  mockedRouter.canGoBack.mockReset();
  mockedRouter.back.mockReset();
  mockedRouter.replace.mockReset();
});

describe('goBack', () => {
  it('calls router.back() when there is history to go back to', () => {
    mockedRouter.canGoBack.mockReturnValue(true);
    goBack();
    expect(mockedRouter.back).toHaveBeenCalledTimes(1);
    expect(mockedRouter.replace).not.toHaveBeenCalled();
  });

  it('falls back to replacing with Home when there is no history (e.g. a direct deep link)', () => {
    mockedRouter.canGoBack.mockReturnValue(false);
    goBack();
    expect(mockedRouter.replace).toHaveBeenCalledWith('/');
    expect(mockedRouter.back).not.toHaveBeenCalled();
  });
});
