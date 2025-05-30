import { formatdbDate } from '.';

const formatKey = (key: string) => {
  // Replace underscores with spaces
  let formattedKey = key.replace(/_/g, ' ');

  // Split the string into words
  let words = formattedKey.split(' ');

  // Capitalize the first letter of each word
  words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  // Join the words back together
  formattedKey = words.join(' ');

  return formattedKey;
};

export const renderProjectDetailsExtras = (
  extras: JSON | string | Record<string, any>,
) => {
  if (typeof extras === 'string') {
    // If the string is a valid date, format it
    if (!Number.isNaN(Date.parse(extras))) {
      return (
        <p className="font-light">
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }).format(new Date(extras))}
        </p>
      );
    }
    // Return nothing if the string is empty
    if (extras.trim() === '') return null;
    return <p className="font-light">{extras}</p>;
  }
  return Object.keys(extras).map((key) => {
    const value = (extras as Record<string, any>)[key];

    if (
      key === 'treasury' ||
      value == null ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return null;
    }

    const formattedKey = formatKey(key);

    return (
      <div key={key}>
        {typeof value === 'object' && value !== null ? (
          renderProjectDetailsExtras(value)
        ) : (
          <>
            {typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? (
              <p className="font-medium text-primary">
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }).format(new Date(value))}
              </p>
            ) : (
              <p className="font-medium text-primary">{String(value)}</p>
            )}
            <p className="font-light">{formattedKey}</p>
          </>
        )}
      </div>
    );
  });
};

// RP PROJECT EXTRAS
export const renderRowBasedProjectDetailsExtras = (
  extras: JSON | string | Record<string, any>,
) => {
  if (typeof extras === 'string') {
    return <p className="font-light">{extras}</p>;
  }
  return Object.keys(extras).map((key) => {
    const value = (extras as Record<string, any>)[key];

    if (key === 'treasury') {
      return null;
    }

    const formattedKey = formatKey(key);

    return (
      <div key={key}>
        {typeof value === 'object' && value !== null ? (
          renderProjectDetailsExtras(value)
        ) : (
          <>
            <p className="font-normal text-neutral-400 text-sm">
              {formattedKey}
            </p>
            <p className="font-normal text-base">{String(value)}</p>
          </>
        )}
      </div>
    );
  });
};
