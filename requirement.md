I would like to create concise functional requirements for the following application:

The app is called FluentAI and is assistance application for children with stuttering disorder. The app shall assist the children with DAF (Delayed Auditory Feedback), and provide the child with appropriate excercises

My Requirements:

- The app should have the two main interface:
  - 1. The DAF interface: 
    + Where we can press a button to start listening to the speaker's voice. Also, a button to stop listening.
    + The interface will capture the voice of speaker and display a waveform visualizer
    + The interface will recognize the words of the speaker and display it in real-time. The words whhere the speaker stutter will be highlighted
    + There is a DAF Modal/window that will only active when the start listening button is pressed.
    + The interface can display to the speaker the score of there speaking, telling them how good are their speaking. This score can be display by a bar or a circle. When the stop listening button is pressed, the score will stop changing and display a comment on the speaking of the speaker (e.g. You're almost perfect, just a few mistakes)

  - 2. The excercise interface:
    + The interface will shows statistics of the speaking of the speaker: What words are stuttered recently; The frequency of stuttering (e.g. how many times the speaker stutter each 10 minutes of speaking), The current speaking score, Most frequently stuttered words
    + A plan on exercising (e.g. With the current state of speaking, you should practise speaking about 10 minutes a days, 2 minutes for excercise A, 2 minutes for exercise B, ...)
    + Various kinds of exercises for the speakers according to the practice plan

- The two interfaces can be organized in two pages of the website
- For clarification, the DAF features is a real-time things. The excercises are the options which the speaker and choose to use whenever they like






<!-- - The main purpose of the application is to demo the workflow of our system. Therefore, besides the real functioning of the two main interfaces mentioned about, I also want a window that constantly display the state of the system. It will tell us what module is working in the system. The workflow of modules is presented in the image I attached. What module is working will be highlighted (e.g. glowing, change color, etc.). What module being idle will have a less prominent appearance (e.g. be colored grey). -->
  






- It should integrate with the OpenAI APIs. The image model used is gpt-image-1
- The app should have a unified interface with a chat input and a timeline of results
- The timeline should be scrollable and have infinite loading with pagination
- The timeline should be responsive, a grid of 1 on mobile, 2 on tablet and 4 on desktop
- There should be minimal filters on the timeline, with the ability to filter by
  - date
  - status
  - aspect ratio
  - order by newest first or oldest first
- You should be able to download each image by clicking on it
- There should be a details view for the entire prompt which shows:
  - all images for the prompt
  - the jobId
  - created
  - status
  - image count
  - dimensions
  - model
  - quality
  - allow to easily re-run the prompt and download each of the images
- The images should be shown in their correct aspect ratio but within a square container
- You are able to submit the prompt multiple times; more items will be added to the timeline (as background jobs)
- Each prompt can have the following options:
  - quality: (low, mid, high)
  - aspect ratio: 1024x1024, 1536x1024, 1024x1536
  - output_compression ((0-100%)) - default is 50%
  - output_format should be webp
  - moderation should be "low"
  - n (number of images to generate)
  - response_format should be b64_json
  - model should be "gpt-image-1"
- You should be able to see a previous prompt and easily rerun it by clicking on it
- The response images should be stored locally in the browser storage
- You should have a simple navigation bar with a settings button
- In the settings menu you can set your OpenAI API key which is also stored locally in the browser storage
- There is already a codebase using Next.js 15, TailwindCSS, Lucide Icons, React Hook Form with zod and Shadcn UI.

Output as markdown code.
