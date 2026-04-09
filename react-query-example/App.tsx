import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getTodos, postTodo } from '../my-api'

/**
 * 1. THE NEWS STATION (QueryClient)
 * This is the headquarters. It holds the "Big Screen" (the Cache)
 * and the "Phone Lines" (the Network logic).
 */
const queryClient = new QueryClient()

function App() {
  return (
    /**
     * 2. THE BROADCAST TOWER (QueryClientProvider)
     * This makes sure every reporter in the building can see 
     * the Teleprompter. Without this, the reporter is blind.
     */
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  /**
   * 3. THE BACKSTAGE INTERCOM (useQueryClient)
   * This gives the reporter a button to talk to the Crew backstage.
   */
  const queryClient = useQueryClient()

  /**
   * 4. READING THE TELEPROMPTER (useQuery)
   * * WHAT IT DOES: 
   * This "hooks" the reporter's eyes to the screen labeled ['todos'].
   * * DUMB PERSON EXPLANATION:
   * The reporter says: "Hey Crew, show me the 'todos' screen. 
   * If it's empty, go call the 'getTodos' office and get the info!"
   * * REACT FUNDAMENTALS (The Trigger):
   * This hook uses an internal "Observer." If the Crew changes the 
   * words on the Teleprompter, the hook "pokes" the Reporter 
   * (Fiber Node) to re-read (re-render) the text.
   */


//   {
//   data: [...],      // The actual "News" from the teleprompter
//   error: null,      // The "Error Report" if the phone lines cut out
//   isPending: false, // Flag: "Are we still typing the news?"
//   isError: false,   // Flag: "Did the Fact-Checker fail?"
//   refetch: f(),     // A manual "Reload" button for the reporter
//   // ...and about 20 other properties
// }
// use query return an address to an object above. it contains data, error, isPending, isError, refetch, etc.
// we have a hash map located in query. we can see the values of the key "data" and also the function "refetch" that has a value of a reference to 
// the function we can use to update the data in the cache. 
// 'todos' is used to have their internal hash map of keys and values of that todos whatever that is.
  const query = useQuery({ 
    queryKey: ['todos'], // this is the key to identify the data in the cache
    queryFn: getTodos // this is the function that will be called to get the data
  })

  // at this point, we have todos crucial data from our source of trut called cach. we also have access to the refetch function so the 
  // staff can begin their updating of the cache. 
  /**
   * 5. THE NEWS UPDATE (useMutation)
   * * WHAT IT DOES:
   * This is how we send a new story to the main office (the API).
   * * THE RATIONALE:
   * After we send the new todo (postTodo), the "Staff" needs to 
   * update the Teleprompter so the Reporter knows what to say next.
   */

  // The returned object 'mutation' looks like this:
// {
//   mutate: f(),        // THE TRIGGER: The button that sends the agent to Earth.
//   mutateAsync: f(),   // THE TRIGGER (Promise version): For when you want to 'await' the result.
//   data: undefined,    // The result *returned* by the server (e.g., the newly created task).
//   error: null,        // What went wrong during the action.
//   isPending: false,   // Flag: "Is the agent still traveling to the server?"
//   isSuccess: false,   // Flag: "Did the change happen?"
//   reset: f(),         // Clean up the mutation state.
// }
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      /**
       * 6. "INVALIDATE" (The Remote Control)
       * * ANALOGY: The Crew presses a button to CLEAR the Teleprompter.
       * * REASONING: We just added a Todo. The current screen is now "old news."
       * By invalidating ['todos'], the Crew automatically fetches fresh 
       * data and types it onto the screen. 
       * * THE MAGIC: The Reporter sees the screen change and automatically 
       * speaks the new list. The audience thinks the reporter is genius.
       */
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  /**
   * 7. THE SCRIPT (The Render)
   * The reporter just maps through `query.data`. If the screen is 
   * loading, they say "Loading..." If the screen has data, they 
   * read the titles. They don't know WHERE the data came from.
   */
  return (
    <div>
      <ul>
        {query.data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          // Tell the Crew to send a "Do Laundry" update to the server
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}