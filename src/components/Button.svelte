<!-- NOTE: this is a test component and is not being used anywhere in the app -->

<script>
	export let name;

  let buttonText = 'Button'

  function handleClick() {
    buttonText = 'Button Clicked'
  }
</script>

<h1>Hello {name}!</h1>

<button on:click="{handleClick}">{buttonText}</button>