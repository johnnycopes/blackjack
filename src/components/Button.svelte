<!-- NOTE: this is a test component and is not being used anywhere in the app -->

<script>
  let buttonText = 'Button'

  function handleClick() {
    buttonText = 'Button Clicked'
  }
</script>

<button on:click="{handleClick}">{buttonText}</button>