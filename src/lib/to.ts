// https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/

// Proper error handling for async/await:
// import to from './to.js';
// [err, user] = await to(UserModel.findById(1));
// if(!user) throw new CustomerError('No user found');

export default function<T, E extends Error = Error>(
  p: PromiseLike<T>
): PromiseLike<[E | null, T | null]> {
  return p.then(
    (r) => [null, r],
    (e) => [e, null]
  )
}
