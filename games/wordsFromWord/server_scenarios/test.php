<form method="post" action="index.php">
    <div>
        <label for="initial">
            <input id="initial" type="radio" name="action" value="getInitialInfo" checked>getInitialInfo
        </label>
    </div>

    <div>
        <label for="userWord">
            UserWord: <input id="userWord" type="text" name="userWord" >
        </label>
        <label for="checkWord">
            <input id="checkWord" type="radio" name="action" value="checkWord"> checkWord
        </label>
    </div>
    <button type="submit">Submit</button>
</form>